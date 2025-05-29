import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import React, { useEffect, useState } from 'react';

export type DnDItem<T> = {
  id: string;
  data: T;
};

export type DnDSection<T> = {
  id: string;
  title: React.ReactNode;
  items: DnDItem<T>[];
};

export type DnDBoardProps<T> = {
  sections: DnDSection<T>[];
  onReorder: (sections: DnDSection<T>[]) => void;
  renderItem: (item: DnDItem<T>) => React.ReactNode;
  canMoveSections?: boolean;
  sectionClassName?: string;
  containerClassName?: string;
};

export function DnDBoard<T>({ sections, onReorder, renderItem, canMoveSections = false, sectionClassName, containerClassName }: DnDBoardProps<T>) {
  const [localSections, setLocalSections] = useState<DnDSection<T>[]>(sections);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'SECTION' && canMoveSections) {
      const newSections = Array.from(localSections);
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);
      setLocalSections(newSections);
      onReorder(newSections);
      return;
    }

    const sourceSection = localSections.find((s) => s.id === source.droppableId);
    const destSection = localSections.find((s) => s.id === destination.droppableId);

    if (!sourceSection || !destSection) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceItems = Array.from(sourceSection.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceSection.id === destSection.id) {
      sourceItems.splice(destination.index, 0, movedItem);
      const updatedSections = localSections.map((section) => (section.id === sourceSection.id ? { ...section, items: sourceItems } : section));
      setLocalSections(updatedSections);
      onReorder(updatedSections);
    } else {
      const destItems = Array.from(destSection.items);
      destItems.splice(destination.index, 0, movedItem);

      const updatedSections = localSections.map((section) => {
        if (section.id === sourceSection.id) {
          return { ...section, items: sourceItems };
        }
        if (section.id === destSection.id) {
          return { ...section, items: destItems };
        }
        return section;
      });

      setLocalSections(updatedSections);
      onReorder(updatedSections);
    }
  };

  return (
    <div className={`flex overflow-x-auto p-2 ${containerClassName || ''}`}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="SECTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-4 min-w-fit">
              {localSections.map((section, index) => {
                const sectionContent = (
                  <Droppable droppableId={section.id} key={section.id} type="ITEM">
                    {(provided, snapshot) => {
                      const isDraggingFromOther = snapshot.isDraggingOver && snapshot.draggingFromThisWith == null;
                      return (
                        <div
                          className={`bg-[var(--secondaryalt)] rounded-2xl p-4 min-h-[200px] border border-[var(--border)] shadow-sm flex flex-col ${
                            sectionClassName || ''
                          } ${snapshot.isDraggingOver ? 'bg-[var(--secondaryalthover)]' : ''} ${snapshot.isDraggingOver ? 'bg-[var(--secondaryalthover)] outline-[2px] outline-[var(--primary)] outline-dashed' : ''}`}
                        >
                          <h3 className="text-lg font-semibold mb-3 text-[var(--font)] flex-shrink-0">{section.title}</h3>
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            <div className={`flex flex-col gap-2 min-h-[100px]`}>
                              {section.items.length === 0 && isDraggingFromOther && (
                                <div className="text-center text-sm text-[var(--font)] italic">Suelta aquí para mover</div>
                              )}
                              {section.items.map((item, index) => (
                                <Draggable draggableId={item.id} index={index} key={item.id}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)] hover:bg-[var(--primary)] transition-colors"
                                    >
                                      {renderItem(item)}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Droppable>
                );

                return canMoveSections ? (
                  <Draggable draggableId={section.id} index={index} key={section.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex-shrink-0 w-[300px]">
                        {sectionContent}
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <div key={section.id} className="flex-shrink-0 w-[300px]">
                    {sectionContent}
                  </div>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
