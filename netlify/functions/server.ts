import app from "../../server/app";

export default async (request: Request) => {
	return app.fetch(request);
};
