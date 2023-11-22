import request from "supertest";
import app from "../index"; // Import your Express app

describe("GET /", () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(3000, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
  it("responds with 200", async () => {
    const response = await request(server).get("/");
    expect(response.statusCode).toBe(200);
  });
});
