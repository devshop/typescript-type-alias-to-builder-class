import { commands, window, workspace } from 'vscode'

import { IWindow } from './interfaces/window.interface'
import { execute } from './type-alias-to-builder'
import { getWorkspaceFolder } from './utils/workspace-util'

export const activate = () => {
  const workspaceRoot: string = getWorkspaceFolder(workspace.workspaceFolders)
  commands.registerCommand('extension.typeAliasToBuilder', () => {
    execute(workspaceRoot, window as IWindow)
  })
}
