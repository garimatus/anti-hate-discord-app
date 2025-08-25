export function relativeLeavingText(secondsToLeave: number): string {
  return `🚫 I need Administrator permissions to function properly and unlock my full capabilities.\
  You can reinvite me with the required permissions here:\
  https://discord.com/oauth2/authorize?client_id=1132258417113841715&permissions=8&integration_type=0&scope=bot
  \n👋 Leaving the server ${secondsToLeave ? 'in ' + secondsToLeave : 'now'}. See you soon!`
}
