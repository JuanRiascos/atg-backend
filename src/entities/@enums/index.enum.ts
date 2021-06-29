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

export enum TypesExtraReps {
  Glossary = 'glosary',
  Resource = 'resource',
  Template = 'template'
}

export enum TypesRecurrence {
  Annual = 'annual',
  Monthly = 'monthly'
}

export enum StateSubscription {
  Active = "active",
  Past_due = "past_due",
  Unpaid = "unpaid",
  Canceled = "canceled",
  Incomplete = "incomplete",
  Incomplete_expired = "incomplete_expired",
  Trialing = "trialing"
}

export enum StateTry {
  Started = 'started',
  Finished = 'finished'
}