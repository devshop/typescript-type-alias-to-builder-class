import { getTypeAliasProperties } from './type-alias-properties-util'

describe('Type Alias Properties Util', () => {
  it('should return null and an error message if no properties are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = 'foo bar'
    const expectedProperties = null

    // Act
    const properties = getTypeAliasProperties(text, windowMock as any)

    // Assert
    expect(properties).toBe(expectedProperties)
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find any properties defined in the type alias.'
    )
  })

  it('should return a list of properties and no error message if properties are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export type Test = {
      foo: string
      bar: number
    }`
    const expectedProperties = ['foo', 'bar']

    // Act
    const properties = getTypeAliasProperties(text, windowMock as any)

    // Assert
    expect(properties).toEqual(expectedProperties)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})
