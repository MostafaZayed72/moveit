export default defineEventHandler(async (event) => {
   const config = useRuntimeConfig()
   const body = await readBody(event)
   
   if (body && body.email === config.adminEmail && body.password === config.adminPassword) {
     return { success: true }
   }
   
   throw createError({ statusCode: 401, statusMessage: 'Incorrect credentials' })
 })

