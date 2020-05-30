import * as fs from 'fs'
import * as typeToBuilder from './type-alias-to-builder'

import { IPropertyOutput } from './interfaces/property-output.interface'
import { PropertyOutputBuilder } from './interfaces/property-output.interface.builder'

jest.mock('fs')

describe('Type To Builder', () => {
  const testRootLinux = 'fake/path/to/test'
  const testRootWindows = 'fake\\path\\to\\test'

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should stop execution if workspace is not loaded', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute('', windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Please open a directory before creating a builder.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if text editor is not open', () => {
    // Arrange
    const windowMock = {
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(false)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'No open text editor. Please open a type alias file.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no text is not found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'No text found. Please open a type alias file.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if a method is found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export type Test = { foo(bar: string): string }')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Methods defined in types are not currently supported.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no type alias name is found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('foo')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find the type alias name.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should stop execution if no properties are found in the active text editor', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest.fn().mockReturnValue('export type Test = {}')
        }
      },
      showErrorMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'Could not find any properties defined in the type alias.'
    )
    expect(typeToBuilder.generatePropertyOutput).not.toHaveBeenCalled()
    expect(typeToBuilder.generateClass).not.toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).not.toHaveBeenCalled()
  })

  it('should continue execution if all checks are okay', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export type Test = { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }
    jest.mock('./utils/workspace-util', () => ({
      isTextEditorOpen: jest.fn().mockReturnValue(true)
    }))
    jest.mock('./utils/string-util', () => ({
      isTextInEditor: jest.fn().mockReturnValue(true)
    }))
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(typeToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(typeToBuilder.generateClass).toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).toHaveBeenCalled()
  })

  it('should save the file with `.builder` if a `.` is found in the filename', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export type Test = { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.type.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }
    jest.spyOn(typeToBuilder, 'generatePropertyOutput')
    jest.spyOn(typeToBuilder, 'generateClass')
    jest.spyOn(typeToBuilder, 'saveBuilderFile')

    // Act
    typeToBuilder.execute(testRootLinux, windowMock as any)

    // Assert
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
    expect(typeToBuilder.generatePropertyOutput).toHaveBeenCalled()
    expect(typeToBuilder.generateClass).toHaveBeenCalled()
    expect(typeToBuilder.saveBuilderFile).toHaveBeenCalled()
  })

  it('should generate the property output text', () => {
    // Arrange
    const propertyOutput: IPropertyOutput = new PropertyOutputBuilder()
      .withDefinitions(['private firstName: string = undefined'])
      .withExternalSetters([
        `public withFirstName(value: string) {
          this.firstName = value
          return this
        }`
      ])
      .withLocalSetters(['firstName: this.firstName'])
      .build()

    // Act
    const output = typeToBuilder.generatePropertyOutput(
      ['firstName'],
      ['string']
    )

    // Assert
    expect(output.definitions[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.definitions[0].replace(/\s+/g, '')
    )
    expect(output.externalSetters[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.externalSetters[0].replace(/\s+/g, '')
    )
    expect(output.localSetters[0].replace(/\s+/g, '')).toEqual(
      propertyOutput.localSetters[0].replace(/\s+/g, '')
    )
  })

  it('should generate the class text', () => {
    // Arrange
    const propertyOutput: IPropertyOutput = new PropertyOutputBuilder()
      .withDefinitions([
        'private firstName: string = undefined',
        'private lastName: string = undefined',
        'private age: number = 1'
      ])
      .withExternalSetters([
        `public withFirstName(value: string) {
          this.firstName = value
          return this
        }`,
        `public withLastName(value: string) {
          this.lastName = value
          return this
        }`,
        `public withAge(value: number) {
          this.age = value
          return this
        }`
      ])
      .withLocalSetters([
        'firstName: this.firstName',
        'lastName: this.lastName',
        'age: this.age'
      ])
      .build()

    // Act
    const classString = typeToBuilder.generateClass('Foo', propertyOutput)

    // Assert
    expect(classString.replace(/\s+/g, '')).toBe(
      `export class FooBuilder {
        private firstName: string = undefined
        private lastName: string = undefined
        private age: number = 1

        public build(): Foo {
          return {
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age
          }
        }

        public withFirstName(value: string) {
          this.firstName = value
          return this
        }

        public withLastName(value: string) {
          this.lastName = value
          return this
        }

        public withAge(value: number) {
          this.age = value
          return this
        }
      }`.replace(/\s+/g, '')
    )
  })

  it('should save the builder file in linux os', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export type Test = { foo: string }'),
          uri: {
            fsPath: `${testRootLinux}/bar.type.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }

    // Act
    typeToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
  })

  it('should save the builder file in windows os', () => {
    // Arrange
    const windowMock = {
      activeTextEditor: {
        document: {
          getText: jest
            .fn()
            .mockReturnValue('export type Test = { foo: string }'),
          uri: {
            fsPath: `${testRootWindows}\\bar.type.ts`
          }
        }
      },
      showErrorMessage: jest.fn(),
      showInformationMessage: jest.fn()
    }

    // Act
    typeToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
    expect(windowMock.showErrorMessage).not.toHaveBeenCalled()
    expect(windowMock.showInformationMessage).toHaveBeenCalled()
  })

  it('should show error message when saving file fails', () => {
    // Arrange
    const windowMock = {
        activeTextEditor: {
          document: {
            getText: jest
              .fn()
              .mockReturnValue('export type Test = { foo: string }'),
            uri: {
              fsPath: `${testRootLinux}/bar.type.ts`
            }
          }
        },
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn()
      }
      // tslint:disable-next-line: variable-name
    ;(fs.writeFileSync as any).mockImplementation(() => {
      throw new Error('Some error')
    })

    // Act
    typeToBuilder.saveBuilderFile(
      windowMock as any,
      windowMock.activeTextEditor as any,
      'foo'
    )

    // Assert
    expect(windowMock.showErrorMessage).toHaveBeenCalledWith(
      'File save failed: Error: Some error'
    )
    expect(windowMock.showInformationMessage).not.toHaveBeenCalled()
  })
})
