export default {
  async fetch(request, env, ctx) {
    // Get the value for the "to-do:123" key
    // NOTE: Relies on the `TODO` KV binding that maps to the "My Tasks" namespace.
    let value = await env.TODO.get('to-do:123');

    // Return the value, as is, for the Response
    return new Response(value);
  },
};
