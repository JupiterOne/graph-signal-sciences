# Development

The Signal Science API docs can be found
[here](https://docs.fastly.com/signalsciences/api/). Additional developer guides
can be found [here](https://docs.fastly.com/signalsciences/developer/).

## Provider account setup

In order to use the Signal Science API, you will need to have a user account.
Once invited, click on `My Profile` at the top right of page. Click
[API Access Tokens](https://dashboard.signalsciences.net/corps/jupiterone/user/apitokens)
from the drop down.

Click
[Add API access token](https://dashboard.signalsciences.net/corps/jupiterone/user/apitokens#add)
to add a new token, provide a name to identify this access token.

**Note:** The role of the user will be applied to the access token. Any role is
sufficient but **Observer** is recommended.

Copy the access token for use in the next step.

## Authentication

Here are
[details](https://docs.fastly.com/signalsciences/developer/using-our-api/) about
how to authenticate.

In essence, include these two headers in every request:

```
 x-api-user: email@email.com
 x-api-token: example-234d2-3ocke-vmeow-bcoiekw
```

Replacing `email@email.com` with your Signal Science username/email and the
example token with the value copied from the previous step.
