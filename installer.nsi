; Weenus AI Installer Script (NSIS)
; Modern UI installer with custom branding

!include "MUI2.nsh"
!include "x64.nsh"

; Configuration
Name "Weenus AI"
OutFile "Weenus AI Setup 0.1.0.exe"
InstallDir "$PROGRAMFILES\Weenus AI"
BrandingText "Weenus AI v0.1.0"

; UI Configuration
!define MUI_ICON "${NSISDIR}\..\..\src\assets\icons\icon.ico"
!define MUI_UNICON "${NSISDIR}\..\..\src\assets\icons\icon.ico"

; Colors and branding
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_NOAUTOCLOSE
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "Weenus AI"
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKCU"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "Software\Weenus AI"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "Start Menu Folder"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_STARTMENU "Weenus AI" $StartMenuFolder
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Language
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Install"
  SetOutPath "$INSTDIR"
  
  ; Files to install
  File /r "build\electron\*"
  File /r "build\renderer\*"
  File /r "node_modules\*"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Registry entries for uninstall
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Weenus AI" "DisplayName" "Weenus AI"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Weenus AI" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Weenus AI" "DisplayVersion" "0.1.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Weenus AI" "Publisher" "Weenus AI"
  
  ; Create shortcuts
  !insertmacro MUI_STARTMENU_WRITE_BEGIN "Weenus AI"
  CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\Weenus AI.lnk" "$INSTDIR\weenus-ai.exe"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
  !insertmacro MUI_STARTMENU_WRITE_END
  
  ; Desktop shortcut
  CreateShortCut "$DESKTOP\Weenus AI.lnk" "$INSTDIR\weenus-ai.exe"
SectionEnd

; Uninstaller section
Section "Uninstall"
  RMDir /r "$INSTDIR"
  !insertmacro MUI_STARTMENU_GETFOLDER "Weenus AI" $StartMenuFolder
  RMDir /r "$SMPROGRAMS\$StartMenuFolder"
  Delete "$DESKTOP\Weenus AI.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Weenus AI"
SectionEnd
