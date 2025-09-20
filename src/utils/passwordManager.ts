import bcrypt from "bcryptjs";

export class PasswordManager {
  static async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async compare(password: string, dbPassword: string) {
    return await bcrypt.compare(password, dbPassword);
  }
}
