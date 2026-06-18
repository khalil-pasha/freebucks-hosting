import axios from 'axios';

export class PterodactylService {
  private static isAppConfigured(): boolean {
    return !!(process.env.PTERODACTYL_PANEL_URL && process.env.PTERODACTYL_API_KEY);
  }

  private static isClientConfigured(): boolean {
    return !!(process.env.PTERODACTYL_PANEL_URL && process.env.PTERODACTYL_CLIENT_KEY);
  }

  private static getAppHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
      'Content-Type': 'application/json',
    };
  }

  private static getClientHeaders() {
    return {
      'Authorization': `Bearer ${process.env.PTERODACTYL_CLIENT_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
      'Content-Type': 'application/json',
    };
  }

  public static async createUser(email: string, username: string, first_name: string, last_name: string, password?: string) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }

    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
    const data = {
      email,
      username,
      first_name,
      last_name,
      password: password || undefined
    };

    const response = await axios.post(url, data, { headers: this.getAppHeaders() });
    return response.data.attributes.id as number;
  }

  public static async updateUserPassword(pteroUserId: number, email: string, username: string, first_name: string, last_name: string, password?: string) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }

    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users/${pteroUserId}`;
    const data = {
      email,
      username,
      first_name,
      last_name,
      password: password || undefined
    };

    await axios.patch(url, data, { headers: this.getAppHeaders() });
    return true;
  }

  public static async createServer(name: string, ramGB: number, cpu: number, disk: number, pteroUserId: number) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }

    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers`;
    const data = {
      name,
      user: pteroUserId, // Ensure the Ptero user ID exists, usually linked to DB User
      egg: parseInt(process.env.PTERODACTYL_EGG_ID || '1', 10),
      docker_image: 'ghcr.io/pterodactyl/yolks:java_25',
      startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}',
      environment: {
        SERVER_JARFILE: 'server.jar',
        BUILD_NUMBER: 'latest',
        EULA: '1'
      },
      limits: {
        memory: ramGB * 1024,
        swap: 0,
        disk: disk * 1024,
        io: 500,
        cpu: cpu
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1
      },
      deploy: {
        locations: [parseInt(process.env.PTERODACTYL_LOCATION_ID || '1', 10)],
        dedicated_ip: false,
        port_range: []
      }
    };

    console.log('[Pterodactyl] Sending Create Server Payload:', JSON.stringify(data, null, 2));

    try {
      const response = await axios.post(url, data, { headers: this.getAppHeaders() });
      return {
        id: response.data.attributes.id,
        identifier: response.data.attributes.identifier,
      };
    } catch (err: any) {
      console.error('[Pterodactyl] Create Server Error. Status:', err.response?.status);
      console.error('[Pterodactyl] Create Server Error Data:', JSON.stringify(err.response?.data || err.message, null, 2));
      throw err;
    }
  }

  public static async updateServerBuild(serverId: number, ramGB: number, cpu: number, disk: number) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }

    const getUrl = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`;
    const getRes = await axios.get(getUrl, { headers: this.getAppHeaders() });
    const allocationId = getRes.data.attributes.allocation;

    const patchUrl = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}/build`;
    const data = {
      allocation: allocationId,
      memory: ramGB * 1024,
      swap: 0,
      disk: disk * 1024,
      io: 500,
      cpu: cpu,
      threads: null,
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1
      }
    };
    await axios.patch(patchUrl, data, { headers: this.getAppHeaders() });
    return true;
  }

  public static async getServerAllocation(identifier: string) {
    if (!this.isClientConfigured()) {
      throw new Error('Pterodactyl Client API is not configured');
    }
    try {
      const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}`;
      const response = await axios.get(url, { headers: this.getClientHeaders() });
      const allocs = response.data.attributes.relationships?.allocations?.data;
      if (allocs && allocs.length > 0) {
        const primary = allocs.find((a: any) => a.attributes.is_default) || allocs[0];
        return {
          ip: primary.attributes.ip,
          alias: primary.attributes.ip_alias,
          port: primary.attributes.port
        };
      }
      return null;
    } catch (err: any) {
      console.error(`[Pterodactyl] Error fetching allocation for ${identifier}: ${err.message}`);
      return null;
    }
  }

  public static async powerServer(identifier: string, signal: 'start' | 'stop' | 'restart' | 'kill') {
    if (!this.isClientConfigured()) {
      throw new Error('Pterodactyl Client API is not configured');
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/power`;
    await axios.post(url, { signal }, { headers: this.getClientHeaders() });
    return true;
  }

  public static async startServer(identifier: string) {
    return this.powerServer(identifier, 'start');
  }

  public static async stopServer(identifier: string) {
    return this.powerServer(identifier, 'kill');
  }

  public static async restartServer(identifier: string) {
    return this.powerServer(identifier, 'restart');
  }

  public static async suspendServer(serverId: number) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}/suspend`;
    await axios.post(url, {}, { headers: this.getAppHeaders() });
    return true;
  }

  public static async deleteServer(serverId: number) {
    if (!this.isAppConfigured()) {
      throw new Error('Pterodactyl Application API is not configured');
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${serverId}`;
    await axios.delete(url, { headers: this.getAppHeaders() });
    return true;
  }

  public static async checkConnection() {
    if (!this.isAppConfigured()) {
      return { status: 'simulation_mode', message: 'API not configured' };
    }

    try {
      const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/users`;
      await axios.get(url, { headers: this.getAppHeaders() });
      return { status: 'ok' };
    } catch (error: any) {
      console.error('Pterodactyl Check Connection Error:', error.message);
      return { status: 'error', message: error.message };
    }
  }

  // ==========================================
  // SERVER PANEL CLIENT API METHODS
  // ==========================================

  public static async getServerStatus(identifier: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/resources`;
    const res = await axios.get(url, { headers: this.getClientHeaders() });
    return res.data.attributes;
  }

  public static async getWebsocketCredentials(identifier: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/websocket`;
    const res = await axios.get(url, { headers: this.getClientHeaders() });
    return res.data.data;
  }

  public static async sendCommand(identifier: string, command: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/command`;
    await axios.post(url, { command }, { headers: this.getClientHeaders() });
  }

  public static async acceptEula(identifier: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/write?file=%2Feula.txt`;
    const res = await axios.post(url, 'eula=true\n', {
      headers: {
        ...this.getClientHeaders(),
        'Content-Type': 'text/plain'
      }
    });
    console.log(`[Pterodactyl] EULA write response status:`, res.status);
    return res.data;
  }

  public static async listFiles(identifier: string, directory: string = '/') {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/list?directory=${encodeURIComponent(directory)}`;
    const res = await axios.get(url, { headers: this.getClientHeaders() });
    return res.data.data.map((f: any) => f.attributes);
  }

  public static async getFileContent(identifier: string, file: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/contents?file=${encodeURIComponent(file)}`;
    const res = await axios.get(url, { headers: this.getClientHeaders(), responseType: 'text' });
    return res.data;
  }

  public static async saveFileContent(identifier: string, file: string, content: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/write?file=${encodeURIComponent(file)}`;
    await axios.post(url, content, { 
      headers: { ...this.getClientHeaders(), 'Content-Type': 'text/plain' }
    });
  }

  public static async renameFiles(identifier: string, root: string, files: {from: string, to: string}[]) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/rename`;
    await axios.put(url, { root, files }, { headers: this.getClientHeaders() });
  }

  public static async chmodFiles(identifier: string, root: string, files: {file: string, mode: string}[]) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/chmod`;
    await axios.post(url, { root, files }, { headers: this.getClientHeaders() });
  }

  public static async compressFiles(identifier: string, root: string, files: string[]) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/compress`;
    await axios.post(url, { root, files }, { headers: this.getClientHeaders() });
  }

  public static async createFolder(identifier: string, root: string, name: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/create-folder`;
    await axios.post(url, { root, name }, { headers: this.getClientHeaders() });
  }

  public static async deleteFiles(identifier: string, root: string, files: string[]) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/delete`;
    await axios.post(url, { root, files }, { headers: this.getClientHeaders() });
  }
  
  public static async getUploadUrl(identifier: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/upload`;
    const res = await axios.get(url, { headers: this.getClientHeaders() });
    return res.data.attributes.url;
  }

  public static async getDownloadUrl(identifier: string, file: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/files/download?file=${encodeURIComponent(file)}`;
    const res = await axios.get(url, { headers: this.getClientHeaders() });
    return res.data.attributes.url;
  }

  public static async getStartupVariables(identifier: string) {
    if (!this.isClientConfigured()) {
      throw new Error('Pterodactyl Client API is not configured');
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/startup`;
    const response = await axios.get(url, { headers: this.getClientHeaders() });
    return response.data.data.map((v: any) => v.attributes);
  }

  public static async updateDockerImage(identifier: string, dockerImage: string) {
    if (!this.isClientConfigured()) {
      throw new Error('Pterodactyl Client API is not configured');
    }
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/settings/docker-image`;
    await axios.put(url, { docker_image: dockerImage }, { headers: this.getClientHeaders() });
    return true;
  }

  public static async getServerDockerImage(pterodactylServerId: number) {
    if (!this.isAppConfigured()) {
      return null;
    }
    try {
      const url = `${process.env.PTERODACTYL_PANEL_URL}/api/application/servers/${pterodactylServerId}`;
      const response = await axios.get(url, { headers: this.getAppHeaders() });
      return response.data.attributes.container.image;
    } catch (err) {
      console.error('[Pterodactyl] Failed to fetch server docker image:', err);
      return null;
    }
  }

  public static async updateStartupVariable(identifier: string, key: string, value: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/startup/variable`;
    await axios.put(url, { key, value }, { headers: this.getClientHeaders() });
  }

  public static async reinstallServer(identifier: string) {
    if (!this.isClientConfigured()) throw new Error('Pterodactyl Client API is not configured');
    const url = `${process.env.PTERODACTYL_PANEL_URL}/api/client/servers/${identifier}/settings/reinstall`;
    await axios.post(url, {}, { headers: this.getClientHeaders() });
  }
}
