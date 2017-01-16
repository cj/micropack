import { send } from 'micro'

export default async function run (req, res) {
  send(res, 200, 'Ready!')
}
