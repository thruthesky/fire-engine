import { expect } from "chai";
import "mocha";
import { chunkArray } from "../../src/library";




describe("Chunk array test", () => {
    it("1/2 should be 1 chunk", async () => {
        const arr = [1];
        const chunks = chunkArray(arr, 2);
        return expect(chunks.length).to.equal(1);
    });
    it("5/5 should be 1 chunk", async () => {
        const arr = [1, 2, 3, 4, 5];
        const chunks = chunkArray(arr, 5);
        return expect(chunks.length).to.equal(1);
    });
    it("5/6 should be 1 chunk", async () => {
        const arr = [1, 2, 3, 4, 5];
        const chunks = chunkArray(arr, 6);
        return expect(chunks.length).to.equal(1);
    });
    it("3/2 should be 2 chunk", async () => {
        const arr = [1, 2, 3];
        const chunks = chunkArray(arr, 2);
        return expect(chunks.length).to.equal(2);
    });
    it("301/10 should be 31 chunk", async () => {
        const arr: number[] = [];
        for (let i = 0; i < 301; i++) {
            arr.push(i);
        }
        const chunks = chunkArray(arr, 10);
        return expect(chunks.length).to.equal(31);
    });
    it("299/10 should be 30 chunk", async () => {
        const arr: number[] = [];
        for (let i = 0; i < 299; i++) {
            arr.push(i);
        }
        const chunks = chunkArray(arr, 10);
        return expect(chunks.length).to.equal(30);
    });
    it("300/10 should be 30 chunk", async () => {
        const arr: number[] = [];
        for (let i = 0; i < 300; i++) {
            arr.push(i);
        }
        const chunks = chunkArray(arr, 10);
        return expect(chunks.length).to.equal(30);
    });
    it("300/300 should be 1 chunk", async () => {
        const arr: number[] = [];
        for (let i = 0; i < 299; i++) {
            arr.push(i);
        }
        const chunks = chunkArray(arr, 300);
        return expect(chunks.length).to.equal(1);
    });
});
