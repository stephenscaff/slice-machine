import Link from 'next/link'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { Link as ThemeLink, Text, Select } from 'theme-ui'

import { ModelContext } from 'src/model-context'
import { LibContext } from 'src/lib-context'
import NavBar from './'

const INDEX = 'INDEX'
const LIB = 'LIB'

const Routes = {
  '/index': INDEX,
  '/[lib]/[sliceName]': LIB
}

const InBuilder = ({ router, ...props }) => {
  const Model = useContext(ModelContext)
  const { info } = Model
  const slices = useContext(LibContext).find(e => e[0] === info.from)[1]
  return (
    <NavBar {...props} {...info}>
      <Link href="/index" as="/" passHref>
        <ThemeLink
          to='/'
          sx={{
            variant: 'styles.navLink',
            p: 2,
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
          <Text as="h4" sx={{ m: 0 }}>
            { info.from } library
          </Text>
        </ThemeLink>
      </Link>

      <Text as="h4" sx={{ m: 0, variant: 'styles.navLink', }}>
          /
      </Text>
      <Select
        sx={{ ml: 2, variant: 'styles.navLink', pl: 2, pr: 4, py: 0, bg: 'rgba(255, 255, 255, .1  )', border: 'none' }}
        onChange={e => location.href = `/${info.href}/${e.target.value}`}
        defaultValue={router.query.sliceName}
      >
        {
          slices.map(e => (
            <option key={e.sliceName}>{e.sliceName}</option>
          ))
        }
      </Select>
    </NavBar>
  )
}
const WithRouter = (props) => {
  const router = useRouter()
  const route = Routes[router.route] || INDEX
  return route === INDEX ? (
    <NavBar {...props}>
      <Link href="/index" as="/" passHref>
        <ThemeLink
          to='/'
          sx={{
            variant: 'styles.navLink',
            p: 2,
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
          <Text as="h4" sx={{ m: 0 }}>
            🍕 Slice Machine
          </Text>
        </ThemeLink>
      </Link>
    </NavBar>
  ) : (
    <InBuilder router={router} {...props} />
  )
}

export default WithRouter