#!/usr/bin/env node

/**
 * MyProj-1 성능 체크 스크립트
 * 빌드 후 번들 크기, 최적화 상태 등을 분석
 */

const fs = require('fs');
const path = require('path');

// 색상 출력을 위한 유틸리티
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(text, color = 'reset') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// 파일 크기를 읽기 쉬운 형태로 변환
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// dist 폴더 분석
function analyzeDistFolder() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    colorLog('❌ dist 폴더가 없습니다. 먼저 빌드를 실행하세요: npm run build', 'red');
    return;
  }

  colorLog('\n📦 번들 크기 분석', 'cyan');
  colorLog('='.repeat(50), 'blue');

  const assetsPath = path.join(distPath, 'assets');
  let totalSize = 0;
  const files = {
    js: [],
    css: [],
    other: []
  };

  // assets 폴더의 모든 파일 분석
  if (fs.existsSync(assetsPath)) {
    const assets = fs.readdirSync(assetsPath);
    
    assets.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const size = stats.size;
      totalSize += size;

      const fileInfo = {
        name: file,
        size: size,
        sizeFormatted: formatBytes(size)
      };

      if (file.endsWith('.js')) {
        files.js.push(fileInfo);
      } else if (file.endsWith('.css')) {
        files.css.push(fileInfo);
      } else {
        files.other.push(fileInfo);
      }
    });
  }

  // JavaScript 파일들 출력
  if (files.js.length > 0) {
    colorLog('\n🟨 JavaScript 파일들:', 'yellow');
    files.js
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const color = file.size > 500 * 1024 ? 'red' : file.size > 200 * 1024 ? 'yellow' : 'green';
        colorLog(`  ${file.name}: ${file.sizeFormatted}`, color);
      });
  }

  // CSS 파일들 출력
  if (files.css.length > 0) {
    colorLog('\n🟦 CSS 파일들:', 'blue');
    files.css
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        const color = file.size > 100 * 1024 ? 'red' : file.size > 50 * 1024 ? 'yellow' : 'green';
        colorLog(`  ${file.name}: ${file.sizeFormatted}`, color);
      });
  }

  // 기타 파일들 출력
  if (files.other.length > 0) {
    colorLog('\n🟪 기타 파일들:', 'magenta');
    files.other
      .sort((a, b) => b.size - a.size)
      .forEach(file => {
        colorLog(`  ${file.name}: ${file.sizeFormatted}`, 'reset');
      });
  }

  colorLog('\n📊 전체 요약', 'cyan');
  colorLog('='.repeat(30), 'blue');
  colorLog(`총 번들 크기: ${formatBytes(totalSize)}`, totalSize > 2 * 1024 * 1024 ? 'red' : 'green');
  colorLog(`JavaScript: ${files.js.length}개 파일`, 'yellow');
  colorLog(`CSS: ${files.css.length}개 파일`, 'blue');
  colorLog(`기타: ${files.other.length}개 파일`, 'magenta');

  // 성능 권고사항
  colorLog('\n💡 성능 권고사항', 'cyan');
  colorLog('='.repeat(30), 'blue');
  
  const largeJsFiles = files.js.filter(f => f.size > 500 * 1024);
  if (largeJsFiles.length > 0) {
    colorLog('⚠️  500KB를 초과하는 JavaScript 파일들이 있습니다. 코드 분할을 고려하세요.', 'yellow');
  }

  const largeCssFiles = files.css.filter(f => f.size > 100 * 1024);
  if (largeCssFiles.length > 0) {
    colorLog('⚠️  100KB를 초과하는 CSS 파일들이 있습니다. CSS 최적화를 고려하세요.', 'yellow');
  }

  if (totalSize < 1 * 1024 * 1024) {
    colorLog('✅ 훌륭합니다! 번들 크기가 1MB 미만입니다.', 'green');
  } else if (totalSize < 2 * 1024 * 1024) {
    colorLog('👍 좋습니다! 번들 크기가 적절합니다.', 'yellow');
  } else {
    colorLog('⚠️  번들 크기가 2MB를 초과합니다. 최적화가 필요합니다.', 'red');
  }
}

// package.json의 의존성 분석
function analyzeDependencies() {
  colorLog('\n📋 의존성 분석', 'cyan');
  colorLog('='.repeat(30), 'blue');

  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const deps = Object.keys(packageJson.dependencies || {});
  const devDeps = Object.keys(packageJson.devDependencies || {});

  colorLog(`런타임 의존성: ${deps.length}개`, 'green');
  colorLog(`개발 의존성: ${devDeps.length}개`, 'blue');

  // 큰 의존성들 확인
  const heavyDependencies = [
    'moment', 'lodash', 'underscore', 'jquery', 'bootstrap'
  ];

  const foundHeavyDeps = deps.filter(dep => heavyDependencies.includes(dep));
  if (foundHeavyDeps.length > 0) {
    colorLog(`⚠️  무거운 의존성 발견: ${foundHeavyDeps.join(', ')}`, 'yellow');
    colorLog('   더 가벼운 대안을 고려해보세요.', 'yellow');
  }

  // 최적화된 의존성들 확인
  const optimizedDeps = deps.filter(dep => 
    dep.includes('react') || 
    dep.includes('vite') || 
    dep.includes('zustand') ||
    dep.includes('tanstack')
  );

  if (optimizedDeps.length > 0) {
    colorLog(`✅ 최적화된 라이브러리 사용 중: ${optimizedDeps.length}개`, 'green');
  }
}

// 메인 실행
function main() {
  colorLog('\n🚀 MyProj-1 성능 분석 리포트', 'cyan');
  colorLog('='.repeat(50), 'blue');
  colorLog(`분석 시간: ${new Date().toLocaleString()}`, 'reset');

  analyzeDistFolder();
  analyzeDependencies();

  colorLog('\n🎯 추가 최적화 제안', 'cyan');
  colorLog('='.repeat(30), 'blue');
  colorLog('• npm run build:analyze - 상세한 번들 분석', 'reset');
  colorLog('• React DevTools Profiler - 컴포넌트 성능 분석', 'reset');
  colorLog('• Lighthouse - 전반적인 웹 성능 측정', 'reset');
  colorLog('• Bundle Analyzer - 번들 구성 시각화\n', 'reset');
}

main();
