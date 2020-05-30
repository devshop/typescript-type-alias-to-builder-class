import { getTypeDataTypes as getTypeAliasDataTypes } from './type-alias-data-types-util'

describe('Type Alias Datatypes Util', () => {
  it('should return null and an error message if no data types are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export type Test = {}`
    const expectedDataTypes = null

    // Act
    const dataTypes = getTypeAliasDataTypes(text, windowMock as any)

    // Assert
    expect(dataTypes).toBe(expectedDataTypes)
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find any data types defined in the type alias.'
    )
  })

  it('should return a list of data types and no error message if data types are found in the file', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    const text = `export type Test = {
      foo: string
      bar: number
    }`
    const expectedDataTypes = ['string', 'number']

    // Act
    const dataTypes = getTypeAliasDataTypes(text, windowMock as any)

    // Assert
    expect(dataTypes).toEqual(expectedDataTypes)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
  })
})
