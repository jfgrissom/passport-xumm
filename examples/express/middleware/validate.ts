export const validate = (err: Error, user: any, info: any) => {
  if (err) console.error(err)
  console.log(user)
  console.log(info)
  // if the user is good res.redirect('/user/' + user.id);
}
