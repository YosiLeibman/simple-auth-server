const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(cors())

const users = [
	{ id: 1, username: 'yosi', password: 1234, isAdmin: true },
	{ id: 2, username: 'test', password: 1234, isAdmin: false }
]

app.post('/login', (req, res) => {
    console.log(req.body);
	const { username, password } = req.body
	if (username && password) {
		const user = users.find(u => u.username === username)
		if (user) {
			if (user.password == password) {
				jwt.sign(
					{ user: { id: user.id, username, isAdmin: user.isAdmin } },
					'bLaH',
					{ expiresIn: '30m' },
					(err, token) => {
						if (err) {
							res.sendStatus(500)
							throw err
						}
						res.json({ token })
					}
				)
			} else {
				res.status(400).send('wrong password')
			}
		} else {
			res.status(400).send('user not found')
		}
	} else {
		res.status(400).send('missing info')
	}
})

app.post('/signup', (req, res) => {
	const { username, password, isAdmin } = req.body
	if (username && password && isAdmin) {
        req.body.id= Math.random().toString().split(".")[1]
        users.push(req.body)
        res.sendStatus(201)
	}else{
        res.status(400).send("missing info")
    }
})

app.get('/secret', vt, (req, res) => {
	console.log(req.user)
	res.json({msg:'you got me!'})
})

function vt(req, res, next) {
	if (req.header('Authorization')) {
		jwt.verify(req.header('Authorization'), 'bLaH', (err, user) => {
			if (err) {
				res.sendStatus(500)
				throw err
			}
			req.user = user
			next()
		})
	} else {
		res.status(401).send('token not found')
	}
}

app.listen(1000, console.log('rockin1000'))
