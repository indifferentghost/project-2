const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const requests = [];

app.use('/', async (req, res) => {
	const { type } = req.body;

	if (['compute_max', 'compute_min'].includes(type)) {
		requests.push({ length: req.body.length, max: 0, index: 1 });
		const requestId = requests.length - 1;

		return res.json({
			type: "compare",
			left: 0,
			right: 1,
			request_id: requestId
		})
	}

	if (type === 'comp_result') {
		const value = requests[req.body.request_id]

		if (req.body.answer) {
			value.max = value.index;
		}

		value.index += 1

		if (value.index === value.length) {
			return res.json({
				"type": "done",
				"result": value.max,
			})
		}

		res.json({
			type: "compare",
			left: value.max,
			right: value.index,
			request_id: req.body.request_id
		})
	}
});

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
