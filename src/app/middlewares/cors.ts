export function cors(request: any, response: any, next: any) {
	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
	response.setHeader('Access-Control-Allow-Methods', '*');
	response.setHeader('Access-Control-Allow-Headers', '*');
	response.setHeader('Access-Control-Max-Age', '10');
	next();
}
