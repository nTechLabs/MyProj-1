import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 빌드 최적화
  build: {
    // 번들 사이즈 분석을 위한 설정
    rollupOptions: {
      output: {
        // 청크 분할을 통한 번들 최적화
        manualChunks: {
          // 벤더 라이브러리들을 별도 청크로 분리
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['antd'],
          state: ['zustand']
        }
      }
    },
    
    // 최소화 옵션
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 프로덕션에서 console.log 제거
        drop_debugger: true  // debugger 문 제거
      }
    },
    
    // 소스맵 설정 (프로덕션에서는 비활성화)
    sourcemap: false,
    
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000
  },
  
  // 개발 서버 최적화
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // 경로 별칭 설정
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@store': resolve(__dirname, 'src/store'),
      '@api': resolve(__dirname, 'src/api'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@config': resolve(__dirname, 'src/config')
    }
  },
  
  // 미리 번들링할 의존성 지정
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'antd',
      'zustand'
    ]
  }
})
