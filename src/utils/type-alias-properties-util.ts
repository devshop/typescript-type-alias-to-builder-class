import { IWindow } from '../interfaces/window.interface'

/**
 * Extracts the properties that are defined in the type alias.
 *
 * @param text      The type alias text
 * @param window    The VSCode Window
 */
export const getTypeAliasProperties = (text: string, window: IWindow) => {
  // Find all the properties defined in the type alias
  // by looking for words before a colon(:)
  let properties = text.match(/(\w*[^\s][ \t]*)(?=:)/gm)
  if (!properties) {
    window.showErrorMessage(
      'Could not find any properties defined in the type alias.'
    )
    return null
  }
  // Remove extra whitespace
  properties = properties.map(p => p.trim())
  return properties
}
