import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the name of the type alias.
 *
 * @param text      The type alias text
 * @param window    The VSCode Window
 */
export const getTypeAliasName = (text: string, window: IWindow) => {
  // Search for the first word after "export type "
  // to find the name of the type alias.
  const typeAliasNames = text.match(/(?<=\bexport type\s)(\w+)/)
  if (!typeAliasNames) {
    window.showErrorMessage('Could not find the type alias name.')
    return null
  }
  return typeAliasNames[0]
}
