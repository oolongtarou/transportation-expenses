import { toHashed } from "./cipher";

test("password123をハッシュ化できること", () => {
    const hashed = toHashed('password123');
    expect('ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f').toBe(hashed);
});