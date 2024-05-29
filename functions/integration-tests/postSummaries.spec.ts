import axios from "axios";
import { expect } from "chai";

describe("Post summaries test", () => {
  it("should have summaries", async () => {
    const expected = "Hello World from greet-the-world";
    const httpFunctionUri = "http://127.0.0.1:5001/demo-test/us-central1/ext-greet-the-world-greetTheWorld/";
    const res = await axios.get(httpFunctionUri);
    return expect(res.data).to.eql(expected);
  }).timeout(10000);
});
