/**
 * Vite 설정 파일 - 고성능 React 개발 환경 구성
 * 
 * 주요 최적화:
 * - React Fast Refresh로 빠른 핫 리로드
 * - 경로 별칭으로 import 경로 단축 및 성능 향상
 * - 청크 분할을 통한 번들 최적화
 * - Terser를 이용한 고급 압축 및 최적화
 * - 개발/프로덕션 환경별 차별화된 설정
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // ======================================
  // 플러그인 설정
  // ======================================
  plugins: [
    react({
      // React Fast Refresh 활성화 - 상태 보존하며 컴포넌트 핫 리로드
      fastRefresh: true,
      
      // Babel 설정 - 프로덕션 최적화
      babel: {
        plugins: [
          // 프로덕션 빌드에서 PropTypes 완전 제거로 번들 크기 감소
          process.env.NODE_ENV === 'production' && [
            'babel-plugin-transform-remove-prop-types', 
            { removeImport: true }
          ]
        ].filter(Boolean) // falsy 값 제거
      }
    })
  ],
  
  // ======================================
  // 경로 별칭 설정 (Import 성능 최적화)
  // ======================================
  /**
   * 절대 경로 별칭을 통한 import 최적화
   * - 상대 경로 '../../../' 대신 '@/' 사용으로 가독성 향상
   * - 번들러가 모듈 해석 시 더 빠른 성능 제공
   * - IDE 자동완성 및 리팩토링 지원 강화
   */
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),              // 루트 src 디렉토리
      '@components': resolve(__dirname, 'src/components'), // 재사용 컴포넌트
      '@pages': resolve(__dirname, 'src/pages'),   // 페이지 컴포넌트
      '@hooks': resolve(__dirname, 'src/hooks'),   // React Query 훅들
      '@store': resolve(__dirname, 'src/store'),   // Zustand 스토어들
      '@utils': resolve(__dirname, 'src/utils'),   // 유틸리티 함수들
      '@styles': resolve(__dirname, 'src/styles')  // 스타일 파일들
    }
  },
  
  // ======================================
  // 빌드 최적화 (프로덕션 성능 향상)
  // ======================================
  build: {
    // 번들 사이즈 분석을 위한 Rollup 설정
    rollupOptions: {
      output: {
        /**
         * 청크 분할 최적화 (Manual Chunks)
         * 라이브러리별로 분리하여 캐싱 효율성 극대화
         * - 사용자가 페이지 이동 시 변하지 않는 벤더 라이브러리는 캐시 활용
         * - 작은 청크로 분할하여 초기 로딩 시간 단축
         */
        manualChunks: {
          // React 생태계 - 가장 기본이 되는 라이브러리
          'react-vendor': ['react', 'react-dom'],
          
          // 라우팅 - SPA 라우팅 시스템
          'router': ['react-router-dom'],
          
          // 서버 상태 관리 - API 호출 및 캐싱
          'query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          
          // UI 컴포넌트 라이브러리 - 가장 큰 번들 크기
          'ui': ['antd'],
          
          // 클라이언트 상태 관리 - 경량 상태 관리
          'state': ['zustand'],
          
          // 아이콘 번들 - UI 라이브러리와 별도 분리로 선택적 로딩
          'icons': ['@ant-design/icons']
        },
        
        /**
         * 파일명 최적화
         * - 해시를 통한 캐시 무효화 자동화
         * - 청크별 명확한 이름 부여로 디버깅 용이성 향상
         */
        chunkFileNames: (chunkInfo) => {
          // 모듈 ID에서 파일명 추출 (경로 제거)
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.js', '') 
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        
        // 정적 자산 파일명 최적화 (CSS, 이미지, 폰트 등)
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
