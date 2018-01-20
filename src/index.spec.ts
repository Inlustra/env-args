import test from 'ava'
import { load, Options, EnvironmentNotSetError } from './'

test('should not throw if all arguments are fulfilled', t => {
  const args = {
    foo: 'bar',
    baz: null,
    another: false,
    anumber: 0,
    aCompleteObject: {
      test: false
    }
  }
  const actual = load(args)
  t.deepEqual(actual, args)
})

test('should not throw if throwUndefined is false', t => {
  t.notThrows(() => {
    load(
      {
        required: undefined
      },
      {
        throwUndefined: false
      }
    )
  })
})

test('should throw if throwUndefined is not overridden', t => {
  const error = t.throws(() => {
    load({
      required: undefined
    })
  })
  t.is(error.message, 'Missing environment configuration')
})

test('should correctly load them from arguments', t => {
  t.notThrows(() =>
    load(
      {
        required: undefined
      },
      {
        arguments: ['--required=test']
      }
    )
  )
})

test('should correctly load them from process.env', t => {
  process.env['INLUSTRA_ENV_ARGS_REQUIRED'] = 'true'
  let config
  t.notThrows(
    () =>
      (config = load({
        required: undefined
      }))
  )
  t.is(config.required, true)
  delete process.env['INLUSTRA_ENV_ARGS_REQUIRED']
})

test('should correctly load them from process.env with overridden prefix', t => {
  process.env['FOO_REQUIRED'] = 'true'
  let config
  t.notThrows(
    () =>
      (config = load(
        {
          required: undefined
        },
        {
          envPrefix: 'FOO'
        }
      ))
  )
  t.is(config.required, true)
  delete process.env['FOO_REQUIRED']
})

test('should correctly load them from .env file', t => {
  let config
  t.notThrows(
    () =>
      (config = load(
        {
          testVar: undefined
        }
      ))
  )
  t.is(config.testVar, true)
})

test('should correctly load them from overridden .env file', t => {
  let config
  t.notThrows(
    () =>
      (config = load(
        {
          required2: undefined
        },
        {
            dotEnvPath: 'test.env'
        }
      ))
  )
  t.is(config.required2, true)
})
