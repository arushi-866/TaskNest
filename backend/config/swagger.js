module.exports = {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for managing tasks with user authentication',
      contact: {
        name: 'API Support',
        email: 'support@taskmanager.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://your-api-url.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Task: {
          type: 'object',
          required: ['title'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string', maxLength: 200 },
            description: { type: 'string', maxLength: 1000 },
            category: { type: 'string', maxLength: 50 },
            priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
            status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'] },
            dueDate: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isOverdue: { type: 'boolean' },
            teamId: { type: 'string' },
            assignedTo: { type: 'string' }
          }
        },
        Team: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            owner: { type: 'string' },
            members: { type: 'array' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', minLength: 2, maxLength: 50 },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Validation error or user already exists'
            }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' },
                          token: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Invalid credentials'
            }
          }
        }
      },
      '/api/auth/profile': {
        get: {
          tags: ['Authentication'],
          summary: 'Get user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          user: { $ref: '#/components/schemas/User' }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Not authorized'
            }
          }
        }
      },
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'status',
              schema: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'] }
            },
            {
              in: 'query',
              name: 'priority',
              schema: { type: 'string', enum: ['Low', 'Medium', 'High'] }
            },
            {
              in: 'query',
              name: 'category',
              schema: { type: 'string' }
            },
            {
              in: 'query',
              name: 'search',
              schema: { type: 'string' }
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', default: 1 }
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', default: 100 }
            },
            {
              in: 'query',
              name: 'teamId',
              schema: { type: 'string' }
            },
            {
              in: 'query',
              name: 'filter',
              schema: { type: 'string', enum: ['assigned', 'created'] }
            }
          ],
          responses: {
            200: {
              description: 'Tasks retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      pages: { type: 'integer' },
                      data: {
                        type: 'object',
                        properties: {
                          tasks: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Task' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    priority: { type: 'string', enum: ['Low', 'Medium', 'High'] },
                    status: { type: 'string', enum: ['Pending', 'In Progress', 'Completed'] },
                    dueDate: { type: 'string', format: 'date-time' },
                    teamId: { type: 'string' },
                    assignedTo: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Task created successfully'
            },
            400: {
              description: 'Validation error'
            }
          }
        }
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get a specific task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Task retrieved successfully'
            },
            404: {
              description: 'Task not found'
            }
          }
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    priority: { type: 'string' },
                    status: { type: 'string' },
                    dueDate: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Task updated successfully'
            },
            404: {
              description: 'Task not found'
            }
          }
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Task deleted successfully'
            },
            404: {
              description: 'Task not found'
            }
          }
        }
      },
      '/api/tasks/stats': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task statistics',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Statistics retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: {
                        type: 'object',
                        properties: {
                          stats: {
                            type: 'object',
                            properties: {
                              total: { type: 'integer' },
                              pending: { type: 'integer' },
                              inProgress: { type: 'integer' },
                              completed: { type: 'integer' },
                              overdue: { type: 'integer' },
                              byPriority: { type: 'object' },
                              byCategory: { type: 'object' },
                              completionRate: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/teams': {
        get: {
          tags: ['Teams'],
          summary: 'Get user teams',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Teams retrieved successfully'
            }
          }
        },
        post: {
          tags: ['Teams'],
          summary: 'Create a new team',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'Team created successfully' }
          }
        }
      },
      '/api/teams/{id}/invite': {
        post: {
          tags: ['Teams'],
          summary: 'Invite member to team',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['Admin', 'Member'] }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Invitation sent' },
            403: { description: 'Not authorized' }
          }
        }
      }
    }
  };