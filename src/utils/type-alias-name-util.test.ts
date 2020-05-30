import { getTypeAliasName } from './type-alias-name-util'

describe('Type Alias Name Util', () => {
  it('should return the name of the type alias in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export type Test = {
      foo: string
    }`
    const expectedName = 'Test'

    // Act
    const name = getTypeAliasName(text, windowMock as any)

    // Assert
    expect(name).toBe(expectedName)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })

  it('should return null and an error message if the type alias name in the file is not found', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = 'foo bar'
    const expectedName = null

    // Act
    const name = getTypeAliasName(text, windowMock as any)

    // Assert
    expect(name).toBe(expectedName)
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find the type alias name.'
    )
  })
})
