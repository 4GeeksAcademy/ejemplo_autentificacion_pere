const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			token: null,
			user: null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			signup: (email, password, navigate) => {
				fetch(process.env.BACKEND_URL + '/api/signup', {
					method: 'POST',
					body: JSON.stringify({ email, password }),
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						if (data.error) alert(data.error)
						else navigate('/login')
					})
					.catch(error => {
						alert(error)
					})
			},
			login: (email, password, navigate) => {
				fetch(process.env.BACKEND_URL + '/api/login', {
					method: 'POST',
					body: JSON.stringify({ email, password }),
					headers: {
						'Content-Type': 'application/json'
					}
				})
					.then(response => response.json())
					.then(data => {
						if (data.error) alert(data.error)
						else {
							localStorage.setItem('token', data.token)
							setStore({ token: data.token })
							getActions().verifyIdentity()
							navigate('/private')
						}
					})
					.catch(error => {
						alert(error)
					})
			},
			logout: () => {
				setStore({ token: null })
				localStorage.removeItem('token')
			},
			verifyIdentity: () => {
				let token = localStorage.getItem('token')
				if (token) {
					fetch(process.env.BACKEND_URL + '/api/verify_identity', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + token
						}
					})
						.then(response => response.json())
						.then(data => {
							if (data && data.user) {
								setStore({ user: data.user, token: token })
							}
						})
				}
			}
		}
	};
};

export default getState;
