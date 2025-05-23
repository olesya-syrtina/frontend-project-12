import { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useAuth } from '../context/AuthContext.jsx'
import PATHS from '../routes.js'
import Header from './Header.jsx'
import Channels from './Channels.jsx'
import Messages from './Messages.jsx'

import { fetchChannels } from '../slices/channelsSlice.js'
import { fetchMessages } from '../slices/messagesSlice.js'

const HomePage = () => {
  const { isLoggedIn } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(PATHS.LOGIN)
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchChannels())
      dispatch(fetchMessages())
    }
  }, [isLoggedIn, dispatch])

  return (
    <>
      <Header />
      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row">
          <Col md={3} className="border-end pt-5 px-0 bg-light">
            <Channels />
          </Col>
          <Messages />
        </Row>
      </Container>
    </>
  )
}

export default HomePage
