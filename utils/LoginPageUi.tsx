import { faEye, faEyeSlash, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '~/form/Form';
import { Button, FormState, TextField } from '~/form/fields';
import { useMediaQuery } from '~/hooks/useMediaQuery';

type LoginPageUiProps = {
  onSubmit: (_data: FormState) => void;
  methods?: UseFormReturn<FormState>;
  imageUrl?: string;
  tittle?: string;
};

/**
 * Componente para el diseño responsive de la página de login.
 * @param onSubmit Función que se ejecuta al enviar el formulario.
 * @param methods Métodos de react-hook-form.
 * @param imageUrl URL de la imagen de fondo.
 * @param tittle Título de la página.
 */
const LoginPageUi = ({
  onSubmit,
  methods,
  imageUrl = 'https://img.freepik.com/foto-gratis/ejecutivos-gran-sonrisa_1098-3180.jpg?semt=ais_incoming',
  tittle = 'PROYECTO BASE',
}: LoginPageUiProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Imagen de fondo (visible solo en pantallas grandes) */}
      {!isMobile && (
        <div className="relative flex justify-center items-center w-full md:w-1/2">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url('${imageUrl}')`,
            }}
          />
          <div className="absolute inset-0 bg-[var(--primary)] opacity-30" />
          <div className="absolute inset-0 flex justify-center items-center text-5xl font-bold text-white">BIENVENIDO/A</div>
        </div>
      )}

      {/* Formulario de login */}
      <div className="w-full h-screen md:w-1/2 flex flex-col justify-center items-center bg-[var(--bg)] p-6">
        {/* Encabezado */}
        <div className="mb-8 text-center">
          <h1 className="text-xl md:text-2xl md:mb-6 text-[var(--font)]">
            <span className="font-bold text-3xl">{tittle}</span>
          </h1>
        </div>

        {/* Formulario */}
        <Form<FormState> onSubmit={onSubmit} methods={methods} className="w-full max-w-sm space-y-4">
          {/* Campo de usuario */}
          <div className="relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-10 text-gray-500" />
            <TextField
              name="username"
              label="Usuario"
              isRequired
              placeholder="Usuario"
              labelClassName="font-bold"
              inputClassName="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            />
          </div>

          {/* Campo de contraseña */}
          <div className="relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-10 text-gray-500" />
            <TextField
              name="password"
              label="Contraseña"
              isRequired
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              labelClassName="font-bold"
              inputClassName="pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            />
            <button type="button" className="absolute right-3 top-10 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          {/* Botón de login */}
          <Button variant="primary" type="submit" className="w-full font-bold py-3">
            INGRESAR
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPageUi;
