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

  public async fetchDataWithParams(params?: { [key: string]: any }): Promise<any> {
    try {
      // Construct query string from params if they exist
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
      const urlWithParams = `${this.apiEndpoint}${queryString}`;
      console.log(urlWithParams);
     // const response = await fetch(urlWithParams);
      const response = await fetch(urlWithParams);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      return await response.json();
    } catch (error) {
      console.error('fetchData error:', error);
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
