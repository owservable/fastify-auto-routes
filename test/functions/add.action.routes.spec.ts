'use strict';

import * as fs from 'fs';
import * as path from 'path';
import addActionRoutes from '../../src/functions/add.action.routes';

describe('addActionRoutes', () => {
  let fastify: any;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fastify = {
      register: jest.fn(),
      route: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
    };
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should skip actions without required methods', async () => {
    const testFolder = path.join(__dirname, '../test-actions-invalid');
    if (fs.existsSync(testFolder)) {
      fs.rmSync(testFolder, { recursive: true });
    }
    fs.mkdirSync(testFolder, { recursive: true });

    // Create action subfolder
    const actionFolder = path.join(testFolder, 'invalid-action');
    fs.mkdirSync(actionFolder, { recursive: true });

    // Create action file without routes method
    const actionFile = path.join(actionFolder, 'invalid-action.ts');
    fs.writeFileSync(actionFile, `
      module.exports = {
        default: class InvalidAction {
          // Missing routes method
          async asController() {
            return true;
          }
        }
      };
    `);

    await addActionRoutes(fastify, testFolder, 'invalid-action');

    expect(fastify.route).not.toHaveBeenCalled();

    // Cleanup
    fs.rmSync(testFolder, { recursive: true });
  });

  it('should handle empty action folders', async () => {
    const testFolder = path.join(__dirname, '../test-actions-empty');
    if (fs.existsSync(testFolder)) {
      fs.rmSync(testFolder, { recursive: true });
    }
    fs.mkdirSync(testFolder, { recursive: true });

    await expect(addActionRoutes(fastify, testFolder, 'nonexistent-action')).resolves.not.toThrow();

    expect(fastify.route).not.toHaveBeenCalled();

    // Cleanup
    fs.rmSync(testFolder, { recursive: true });
  });

  it('should handle actions with non-function routes property', async () => {
    const testFolder = path.join(__dirname, '../test-actions-non-function');
    if (fs.existsSync(testFolder)) {
      fs.rmSync(testFolder, { recursive: true });
    }
    fs.mkdirSync(testFolder, { recursive: true });

    // Create action subfolder
    const actionFolder = path.join(testFolder, 'non-function-action');
    fs.mkdirSync(actionFolder, { recursive: true });

    // Create action file with non-function routes property
    const actionFile = path.join(actionFolder, 'non-function-action.ts');
    fs.writeFileSync(actionFile, `
      module.exports = {
        default: class NonFunctionAction {
          routes = 'not a function';
          
          async asController() {
            return true;
          }
        }
      };
    `);

    await addActionRoutes(fastify, testFolder, 'non-function-action');

    expect(fastify.route).not.toHaveBeenCalled();

    // Cleanup
    fs.rmSync(testFolder, { recursive: true });
  });
});
