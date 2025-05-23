import { requirePermission } from "../../middlewares/permission";

describe("requirePermission middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should respond 401 if authorization header is missing", () => {
    requirePermission("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Authorization token missing",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and set permission if token is present", () => {
    req.headers.authorization = "Bearer sometoken";

    requirePermission("admin")(req, res, next);

    expect((req as any).permission).toBe("admin");
    expect(next).toHaveBeenCalled();
  });
});
