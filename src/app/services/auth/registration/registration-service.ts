import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import mailer from '@modules/mailer';
import { Role } from '@app/models/auth/role';
import { Model } from '@modules/database/core/orm/model';
import { Activation } from '@app/models/auth/activation';

export abstract class RegistrationService {
  /**
   * Constructor.
   *
   * @param model related model.
   */
  public constructor(protected model: Model) {}

  /**
   * Register an account.
   *
   * @param value account's information.
   */
  public async registerAccount(value: any) {
    const { success } = await this.model.create([
      {
        name: value.name,
        email: value.email,
        password: bcrypt.hashSync(value.password, 10),
      },
    ]);

    return success;
  }

  /**
   * Find role by name.
   *
   * @param name role's name.
   */
  public async findRoleByName(name: string) {
    const { data } = await Role.select('id')
      .where([['name', '=', `v:${name}`]])
      .get();

    return data?.first();
  }

  /**
   * Find the account by email.
   *
   * @param email account's email.
   */
  public async findAccountByEmail(email: string) {
    const { data } = await this.model
      .select('id')
      .where([['email', '=', `v:${email}`]])
      .get();

    return data?.first();
  }

  /**
   * Create an activation code for account.
   *
   * @param accountId ID's account.
   * @param type type of account.
   */
  public async createActivationCode(accountId: number, type: string) {
    const code = randomstring.generate({ length: 25 });
    const { success } = await Activation.create([
      {
        account_id: accountId,
        code,
        type,
      },
    ]);

    return success ? code : '';
  }

  /**
   * Send mail to account's email address.
   *
   * @param email account's email.
   * @param content email's content.
   */
  public sendEmail(email: string, content: string) {
    mailer.send({
      to: email,
      subject: 'Click this link to activate your account',
      text: content,
    });
  }

  /**
   * Assign a role to the account account.
   *
   * @param accountId ID's account.
   * @param roleId ID's role.
   */
  public abstract assign(accountId: string, roleId: string): Promise<boolean>;
}
