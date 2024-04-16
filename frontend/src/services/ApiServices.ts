export class ApiServices {
  private apiEndpoint: string;

  constructor(apiEndpoint: string) {
    this.apiEndpoint = apiEndpoint;
  }

  public async fetchData(): Promise<any> {
    try {
      const response = await fetch(this.apiEndpoint);
      if (!response.ok) {
        throw new Error('Error fetching orders');
      }
      return await response.json();
    } catch (error) {
      console.error('OrderService fetchOrders:', error);
      throw error;
    }
  }

  public async sendData(data: any): Promise<any> {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(this.apiEndpoint, requestOptions);
      if (!response.ok) {
        throw new Error('Error sending order');
      }
      return await response.json();
    } catch (error) {
      console.error('OrderService sendOrder:', error);
      throw error;
    }
  }
  public async sendForm(formData: FormData): Promise<any> {
    try {
        const requestOptions = {
            method: 'POST',
            body: formData 
        };

        const response = await fetch(this.apiEndpoint, requestOptions);
        if (!response.ok) {
            throw new Error('Error sending form');
        }
        return await response.json();
    } catch (error) {
        console.error('ApiServices sendForm:', error);
        throw error;
    }
}

}
