// electron-builder.yml
module.exports = {
  appId: 'com.weenus.ai',
  productName: 'Weenus AI',
  directories: {
    output: 'dist',
    buildResources: 'src/assets/icons'
  },
  files: [
    'build/**/*',
    'node_modules/**/*',
    '!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,tests,*.spec.js,*.test.js,.eslintrc.json,.eslintignore,*.md}'
  ],
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    icon: 'src/assets/icons/icon.ico',
    certificateFile: null,
    certificatePassword: null,
    signingHashAlgorithms: ['sha256'],
    sign: './customSign.js'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Weenus AI',
    installerIcon: 'src/assets/icons/icon.ico',
    uninstallerIcon: 'src/assets/icons/icon.ico',
    installerHeaderIcon: 'src/assets/icons/icon.ico'
  },
  mac: {
    target: ['dmg', 'zip'],
    icon: 'src/assets/icons/icon.icns',
    artifactName: '${productName}-${version}-${arch}.${ext}',
    gatekeeperAssess: false
  },
  linux: {
    target: ['AppImage', 'deb'],
    icon: 'src/assets/icons/icon.png',
    artifactName: '${productName}-${version}-${arch}.${ext}'
  },
  extraMetadata: {
    main: 'build/electron/main.js'
  }
};
