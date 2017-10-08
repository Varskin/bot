/**
 * @file selfDestruct command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.run = async (Bastion, message, args) => {
  if (!message.member.hasPermission(this.help.userPermission)) {
    /**
     * User has missing permissions.
     * @fires userMissingPermissions
     */
    return Bastion.emit('userMissingPermissions', this.help.userPermission);
  }

  if (!args.content) {
    /**
     * The command was ran with invalid parameters.
     * @fires commandUsage
     */
    return Bastion.emit('commandUsage', message, this.help);
  }

  let minTimeout = 5, maxTimeout = 600;
  if (args.timeout < minTimeout || args.timeout > maxTimeout) {
    /**
     * Error condition is encountered.
     * @fires error
     */
    return Bastion.emit('error', Bastion.strings.error(message.guild.language, 'invalidInput'), Bastion.strings.error(message.guild.language, 'selfDestructTimeout', true, minTimeout, maxTimeout), message.channel);
  }

  if (message.deletable) {
    message.delete().catch(e => {
      Bastion.log.error(e);
    });
  }

  try {
    let secretMessage = await message.channel.send({
      embed: {
        color: Bastion.colors.DEFAULT,
        description: args.content.join(' ')
      }
    });
    await secretMessage.delete(args.timeout * 1000);
  }
  catch (e) {
    Bastion.log.error(e);
  }
};

exports.config = {
  aliases: [ 'destruct' ],
  enabled: true,
  argsDefinitions: [
    { name: 'content', type: String, alias: 'c', multiple: true, defaultOption: true },
    { name: 'timeout', type: Number, alias: 't', defaultValue: 30 }
  ]
};

exports.help = {
  name: 'selfDestruct',
  botPermission: '',
  userPermission: 'MANAGE_GUILD',
  usage: 'selfDestruct <content> [-t <seconds>]',
  example: [ 'selfDestruct This will destruct after 30 seconds', 'selfDestruct This will destruct after 10 seconds -t 10' ]
};
