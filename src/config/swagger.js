import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blogging API Documentation',
      version: '1.0.0'
    },
    components: {
      schemas: {
        GetCategoryRequest: {
          type: 'object'
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nombre: {
              type: 'string'
            }
          }
        },
        CreateCategoryRequest: {
          type: 'object',
          properties: {
            nombre: {
              type: 'string'
            }
          }
        },
        UpdateCategoryRequest: {
          type: 'object',
          properties: {
            nombre: {
              type: 'string'
            }
          }
        },
        DeleteCategoryRequest: {
          type: 'object'
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        },
        CreateCommentRequest: {
          type: 'object',
          properties: {
            contenido: {
              type: 'string'
            },
            postId: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            contenido: {
              type: 'string'
            },
            postId: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            }
          }
        },
        DeleteCommentRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer'
            }
          }
        },
        UpdateCommentRequest: {
          type: 'object',
          properties: {
            contenido: {
              type: 'string'
            },
            userId: {
              type: 'integer'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            titulo: {
              type: 'string'
            },
            contenido: {
              type: 'string'
            },
            userId: {
              type: 'integer'
            },
            categorias: {
              type: 'array',
              items: {
                type: 'integer'
              }
            }
          }
        },
        CreatePostRequest: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string'
            },
            contenido: {
              type: 'string'
            },
            userId: {
              type: 'integer'
            },
            categorias: {
              type: 'array',
              items: {
                type: 'integer'
              }
            }
          }
        },
        CreatePostResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            post: {
              $ref: '#/components/schemas/Post'
            }
          }
        },
        UpdatePostRequest: {
          type: 'object',
          properties: {
            titulo: {
              type: 'string'
            },
            contenido: {
              type: 'string'
            },
            categorias: {
              type: 'array',
              items: {
                type: 'integer'
              }
            }
          }
        },
        DeletePostRequest: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/category.router.js', './src/routes/comment.router.js', './src/routes/post.router.js', './src/routes/user.router.js']
}

const openapiSpecification = swaggerJsdoc(options)

export const swaggerDocs = (app) => app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
