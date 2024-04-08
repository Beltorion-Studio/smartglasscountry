// OrderService.ts
export class OrderService {
    private apiEndpoint: string;
  
    constructor(apiEndpoint: string) {
      this.apiEndpoint = apiEndpoint;
    }
  
    public async fetchOrders(): Promise<any> {
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
  
    public async sendOrder(orderData: any): Promise<any> {
      try {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
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
  
    // Add more methods related to order operations as needed.
  }