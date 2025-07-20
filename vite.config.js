import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React Fast Refresh 최적화
      fastRefresh: true,
      // Babel 최적화
      babel: {
        plugins: [
          // 프로덕션에서 PropTypes 제거
          process.env.NODE_ENV === 'production' && ['babel-plugin-transform-remove-prop-types', { removeImport: true }]
        ].filter(Boolean)
      }
    })
  ],
  
  // 경로 별칭 설정 (성능 향상)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@store': resolve(__dirname, 'src/store'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  // 빌드 최적화
  build: {
    // 번들 사이즈 분석을 위한 설정
    rollupOptions: {
      output: {
        // 청크 분할을 통한 번들 최적화 (개선)
        manualChunks: {
          // 벤더 라이브러리들을 별도 청크로 분리
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'ui': ['antd'],
          'state': ['zustand'],
          // 아이콘을 별도로 분리 (크기가 클 수 있음)
          'icons': ['@ant-design/icons']
        },
        // 파일명 최적화
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop().replace('.js', '') : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // 최소화 옵션 (개선)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 프로덕션에서 console.log 제거
        drop_debugger: true, // debugger 구문 제거
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 특정 함수 호출 제거
      },
      mangle: {
        safari10: true, // Safari 10 호환성
      },
      format: {
        comments: false, // 주석 제거
      }
    },
    
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 500, // 500KB
    
    // CSS 코드 분할 활성화
    cssCodeSplit: true,
    
    // 소스맵 설정 (개발 환경에서만 활성화)
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  // 개발 서버 최적화
  server: {
    port: 3000,
    open: true,
    cors: true,
    // HMR 최적화
    hmr: {
      overlay: true
    }
  },
  
  // 미리 번들링할 의존성 지정 (개선)
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'antd',
      'zustand'
    ],
    // 개발 모드에서 제외할 항목들
    exclude: ['@tanstack/react-query-devtools']
  }
})
