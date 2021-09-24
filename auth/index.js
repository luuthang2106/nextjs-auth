import { query } from 'app/mysql'
import { verify } from 'jsonwebtoken'

function check(token) {
    try {
        verify(token, process.env.SECRET_KEY)
        return true
    } catch (error) {
        return false
    }
}
const Auth = {
    check
}
export default Auth
