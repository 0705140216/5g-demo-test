import axios from '@/utils/request'

const BASIC_SC = process.env.NODE_ENV == 'development' ? '/health-screen-cmz' : '/health-screen'

const api = {}

export default api
