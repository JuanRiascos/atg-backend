export enum States {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending"
}

export enum StateNotification {
  Send = 'send',
  Received = 'received',
  Failed = 'failed'
}

export enum TypesNotifications {
  Push = 'push',
  Email = 'email'
}

export enum Events {
  SignupAdmin = 'signup_admin',
  Signup = 'signup',
  ForgotPassword = 'forgot_password'
}