import { createServer, Factory, Model } from 'miragejs'
import { faker } from '@faker-js/faker'

// 定义 Note 类型
export type Note = {
  id: string
  title: string
  content: string
  date: string
}
export type User = {
  id: string
  name: string
  email: string
}

// 定义数据库模型和工厂
export default function makeServer() {
  return createServer({
    models: {
      // 笔记
      note: Model.extend<Note>({
        id: '',
        title: '',
        content: '',
        date: '',
      }),
      // 获取用户列表
      user: Model.extend<User>({
        id: '',
        name: '',
        email: '',
      }),
    },

    factories: {
      note: Factory.extend({
        id() {
          return faker.string.uuid()
        },
        title() {
          return faker.lorem.words(faker.number.int({ min: 5, max: 15 }))
        },
        content() {
          return faker.lorem.paragraph()
        },
        date() {
          return faker.date.recent().toISOString().split('T')[0]
        },
      }),
      user: Factory.extend({
        id() {
          return faker.string.uuid()
        },
        name() {
          return faker.person.fullName()
        },
        email() {
          return faker.internet.email()
        },
      }),
    },
    seeds(server) {
      server.createList('note', 8) // 初始化生成 8 条笔记
      server.createList('user', 5)
    },

    routes() {
      this.namespace = 'api' // 所有路由前缀为 /api

      this.get('/notes/list', (schema) => {
        const notes = schema.all('note')
        return {
          code: 200,
          message: '获取笔记列表成功',
          data: notes.models,
        }
      })

      // 新增接口：获取单个笔记详情
      this.get('/notes/detail/:id', (schema, request) => {
        const id = request.params.id
        const note = schema.find('note', id)
        if (note) {
          return {
            code: 200,
            message: '获取笔记详情成功',
            data: note,
          }
        } else {
          return {
            code: 404,
            message: '笔记不存在',
          }
        }
      })

      this.get('/users/list', (schema) => {
        const users = schema.all('user')
        return {
          code: 200,
          message: '获取用户列表成功',
          data: users.models,
        }
      })
    },
  })
}
