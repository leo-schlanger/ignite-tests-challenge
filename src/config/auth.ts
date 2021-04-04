export default {
  jwt: {
    secret: process.env.JWT_SECRET || "test" as string,
    expiresIn: '1d'
  }
}
