import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd';
import React, { Ref, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export type DnDItem<T> = {
  data: T;
};

export type DnDSection<T> = {
  id: string;
  title: React.ReactNode;
  items: DnDItem<T>[];
  loadingContent?: boolean;
  displayMessage?: React.ReactNode;
};

export const toDnDItem = <T,>(item: T): DnDItem<T> => ({
  data: item as T,
});

export type DnDBoardHandle<T> = {
  moveToSection: (item: T, toSectionId: string) => void;
};

export type DnDBoardProps<T> = {
  sections: DnDSection<T>[];
  onReOrder: (sections: DnDSection<T>[]) => void;
  renderItem: (item: DnDItem<T>) => React.ReactNode;
  getId: (item: T) => string;
  canMoveSections?: boolean;
  sectionClassName?: string;
  containerClassName?: string;
};

function DnDBoardInner<T>(
  { sections, onReOrder, renderItem, canMoveSections = false, sectionClassName, containerClassName, getId }: DnDBoardProps<T>,
  ref: Ref<DnDBoardHandle<T>>
) {
  const [localSections, setLocalSections] = useState<DnDSection<T>[]>(sections);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const handleReorder = (newSections: DnDSection<T>[]) => {
    setLocalSections(newSections);
    onReOrder?.(newSections);
  };

  const moveToSection = (item: T, toSectionId: string) => {
    const itemId = getId(item);

    const currentSectionIndex = localSections.findIndex((section) => section.items.some((i) => getId(i.data) === itemId));

    const targetSectionIndex = localSections.findIndex((section) => section.id === toSectionId);
    if (currentSectionIndex === -1 || targetSectionIndex === -1) return;

    const newSections = [...localSections];
    const sourceSection = newSections[currentSectionIndex];
    const targetSection = newSections[targetSectionIndex];

    const itemIndex = sourceSection.items.findIndex((i) => getId(i.data) === itemId);
    if (itemIndex === -1) return;

    const [movingItem] = sourceSection.items.splice(itemIndex, 1);
    targetSection.items.push(movingItem);

    handleReorder(newSections);
  };

  useImperativeHandle(ref, () => ({
    moveToSection,
  }));

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'SECTION' && canMoveSections) {
      const newSections = Array.from(localSections);
      const [movedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, movedSection);
      handleReorder(newSections);
      return;
    }

    const sourceSection = localSections.find((s) => s.id === source.droppableId);
    const destSection = localSections.find((s) => s.id === destination.droppableId);
    if (!sourceSection || !destSection) return;

    const sourceItems = Array.from(sourceSection.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceSection.id === destSection.id) {
      sourceItems.splice(destination.index, 0, movedItem);
      const updatedSections = localSections.map((section) => (section.id === sourceSection.id ? { ...section, items: sourceItems } : section));
      handleReorder(updatedSections);
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

      handleReorder(updatedSections);
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
                          className={`bg-[var(--secondaryalt)] rounded-2xl p-4 min-h-[200px] border border-[var(--border)] shadow-sm flex flex-col ${sectionClassName || ''} ${snapshot.isDraggingOver ? 'bg-[var(--secondaryalthover)] outline-[2px] outline-[var(--primary)] outline-dashed' : ''} ${section.loadingContent ? 'opacity-50 pointer-events-none cursor-wait animate-pulse' : ''}`}
                        >
                          <h3 className="text-lg font-semibold mb-3 text-[var(--font)] flex-shrink-0">{section.title}</h3>
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            <div className="flex flex-col gap-2 min-h-[100px]">
                              {section.items.length === 0 && isDraggingFromOther && (
                                <div className="text-center text-sm text-[var(--font)] italic">Suelta aquí para mover</div>
                              )}
                              {section.displayMessage && <div className="text-center text-sm text-[var(--font)] italic">{section.displayMessage}</div>}
                              {section.items.map((item, index) => (
                                <Draggable draggableId={getId(item.data)} index={index} key={getId(item.data)}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="rounded-lg border border-[var(--border)] p-0.5 bg-[var(--bg)] transition-colors text-[var(--font)] hover:bg-[var(--secondaryalthover)]"
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

export const DnDBoard = forwardRef(DnDBoardInner) as <T>(props: DnDBoardProps<T> & { ref?: Ref<DnDBoardHandle<T>> }) => ReturnType<typeof DnDBoardInner>;
