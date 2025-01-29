import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/form/fields';

const ErrorScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[var(--bg)] text-[var(--font)] px-2">
      {/* Vector superior */}
      <div className="flex items-center justify-center mr-16">
        <svg width="1920" height="472" viewBox="0 0 1920 472" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_16_344)">
            <path
              d="M963.882 424.273L936.109 445.103L936.76 397.816L884.671 442.129L895.865 385.134L821.068 408.538L854.305 337.488L790.649 338.048L832.315 294.388L778.856 233.62L849.718 253.876L837.54 226.899H855.807L851.513 183.959L883.262 206.416L876.548 106.055L946.027 173.211L950.427 105.522L992.732 168.57C992.732 168.57 1018.84 121.63 1018.84 124.564C1018.84 127.498 1030.73 177.372 1030.73 177.372L1108.01 112.656L1094.98 192.667L1167.88 214.004L1121.49 263.197L1161.14 270.718L1132.43 284.453L1211.05 329.313L1124.11 338.341L1144.65 389.015L1087.71 375.466L1100.9 472L1046.31 415.365L1042.67 457.531L1005.8 405.991L969.905 469.266L963.882 424.273Z"
              fill="#FFDA67"
            />
            <path d="M1054.82 270.105L996.814 275.866L1007.7 204.069L970.596 255.569L1025.57 310.711L1054.82 270.105Z" fill="#101010" />
            <path d="M935.458 304.35L993.37 298.589L982.588 370.386L1019.03 319.792L964.055 264.651L935.458 304.35Z" fill="#101010" />
            <path d="M1057.17 342.395L1025.57 310.711L1019.02 319.818L1049.37 350.223L1057.17 342.395Z" fill="#101010" />
            <path d="M939.366 224.232L931.562 232.059L964.055 264.651L970.596 255.569L939.366 224.232Z" fill="#101010" />
            <path
              d="M904.805 294.729L928.549 370.219L872.762 387.873C871.501 388.272 870.134 388.152 868.961 387.54C867.788 386.928 866.905 385.873 866.507 384.608L845.763 318.656C845.365 317.391 845.485 316.02 846.095 314.843C846.705 313.667 847.757 312.782 849.018 312.383L904.805 294.729Z"
              fill="#F9F6F5"
            />
            <path d="M866.839 385.566L845.503 317.732L813.78 327.771L835.117 395.605L866.839 385.566Z" fill="#F9F6F5" />
            <path d="M828.449 374.398L820.449 348.964L787.56 359.371L795.56 384.806L828.449 374.398Z" fill="#F9F6F5" />
            <path
              d="M791.473 371.893C663.656 412.338 616.379 436.702 582.132 404.31C536.49 361.131 603.736 308.497 574.155 251.142C563.067 229.659 538.258 221.805 510.153 221.805C510.153 221.805 397.558 237.94 375.502 134.166C353.446 30.391 250.875 135.873 225.681 155.702C200.487 175.531 136.526 193.174 120.904 79.0245C105.282 -35.125 1.40918 13.6819 1.40918 13.6819"
              stroke="#F9F6F5"
              stroke-width="5"
              stroke-miterlimit="10"
            />
            <path
              d="M914.079 364.531L877.984 375.986C877.362 376.183 876.708 376.255 876.059 376.197C875.41 376.14 874.778 375.955 874.2 375.653C873.622 375.351 873.11 374.937 872.691 374.436C872.273 373.935 871.957 373.356 871.762 372.733L868.85 363.398"
              stroke="#101010"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M841.263 373.559L832.355 345.235" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M849.187 371.052L840.279 342.728" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M866.47 384.388L845.85 318.845" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M835.107 395.603L813.769 327.753" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M795.542 384.801L787.538 359.371" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M1062.18 274.803L1062.14 274.676C1062.03 274.313 1061.98 273.932 1062.02 273.553C1062.05 273.174 1062.16 272.805 1062.33 272.468C1062.51 272.13 1062.75 271.831 1063.04 271.586C1063.33 271.342 1063.66 271.157 1064.02 271.042L1097.52 260.433L1099.3 266.083L1065.8 276.692C1065.07 276.924 1064.28 276.855 1063.6 276.5C1062.92 276.146 1062.41 275.535 1062.18 274.803Z"
              fill="#A6A6A6"
            />
            <path
              d="M1086.64 222.223L1088.43 227.895L1054.8 238.535C1054.07 238.767 1053.27 238.698 1052.59 238.342C1051.91 237.986 1051.4 237.373 1051.17 236.638L1051.13 236.511C1051.01 236.147 1050.97 235.763 1051 235.383C1051.04 235.003 1051.14 234.633 1051.32 234.294C1051.49 233.955 1051.73 233.655 1052.03 233.409C1052.32 233.164 1052.65 232.978 1053.02 232.864L1086.64 222.223Z"
              fill="#A6A6A6"
            />
            <path
              d="M1178.24 252.667L1157.31 186.117L1171.75 181.547C1176.18 180.146 1180.98 180.566 1185.1 182.717C1189.22 184.867 1192.32 188.57 1193.72 193.012L1204.12 226.077C1205.51 230.518 1205.09 235.332 1202.95 239.461C1200.8 243.59 1197.11 246.696 1192.69 248.097L1178.24 252.667Z"
              fill="#F9F6F5"
            />
            <path d="M1194.97 197.063L1202.82 222.014L1235.09 211.803L1227.24 186.852L1194.97 197.063Z" fill="#F9F6F5" />
            <path d="M1139.38 182.441L1165.66 265.994L1180.91 261.167L1154.63 177.614L1139.38 182.441Z" fill="#F9F6F5" />
            <path
              d="M1231.24 199.535C1357.09 159.716 1403.64 135.726 1437.31 167.624C1482.25 210.136 1416.04 261.944 1445.17 318.418C1456.09 339.568 1479.22 347.756 1507.21 347.756C1591.87 347.756 1610.6 237.554 1610.6 237.554C1610.6 237.554 1615.47 150.301 1676.56 156.129C1737.65 161.956 1759.85 278.173 1759.85 278.173C1759.85 278.173 1777.9 355.517 1836.2 327.606C1894.5 299.696 1916.73 206.042 1916.73 206.042"
              stroke="#F9F6F5"
              stroke-width="5"
              stroke-miterlimit="10"
            />
            <path d="M1182.41 197.895L1191.15 225.672" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1174.63 200.348L1183.37 228.126" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1081.52 205.973L1104.81 280.026L1164.16 261.245L1140.87 187.192L1081.52 205.973Z" fill="#F9F6F5" />
            <path d="M1091.69 238.368L1094.6 247.626L1124.28 238.234L1121.37 228.976L1091.69 238.368Z" fill="#477AFA" />
            <path d="M1129.5 200.882L1135.91 198.855" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1095.86 211.523L1123.55 202.762" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1165.67 265.998L1139.39 182.439" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1154.65 177.612L1180.92 261.17" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1203.55 222.031L1195.71 197.081" stroke="#101010" stroke-width="2" stroke-miterlimit="10" />
            <path d="M1104.82 280.026L1081.53 205.976" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M1227.25 186.853L1235.1 211.817" stroke="#101010" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </g>
          <defs>
            <clipPath id="clip0_16_344">
              <rect width="1920" height="472" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center w-full h-full mt-16">
        {/* Título */}
        <h1 className="text-center text-5xl font-extrabold text-[var(--font)] mb-4">¡Algo salió mal!</h1>

        {/* Descripción */}
        <p className="text-lg text-center max-w-lg">Parece que hemos encontrado un error inesperado.</p>
        <p className="text-lg text-center max-w-lg mb-6">Por favor, inténtalo de nuevo o contáctanos si necesitas ayuda.</p>

        {/* Botones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="primary"
            className="px-6 py-3 bg-[var(--primary)] text-[var(--bg)] rounded-lg shadow-md hover:bg-[var(--hover)] transition"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
          <Button
            type="button"
            variant="primary"
            className="px-6 py-3 bg-[var(--secondary)] text-[var(--bg)] rounded-lg shadow-md hover:bg-[var(--hover)] transition"
            onClick={() => navigate(-1)}
          >
            Volver atrás
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
