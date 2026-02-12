const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Minio = require('minio');
const environment = require('./environment');
const logger = require('../utils/logger');

class StorageService {
  constructor() {
    this.storageType = environment.storage.type;
    this.initializeStorage();
  }

  initializeStorage() {
    switch (this.storageType) {
      case 'S3':
        this.initializeS3();
        break;
      case 'MINIO':
        this.initializeMinIO();
        break;
      case 'LOCAL':
      default:
        this.initializeLocal();
        break;
    }
  }

  initializeS3() {
    if (!environment.s3.accessKeyId || !environment.s3.secretAccessKey) {
      throw new Error('AWS S3 credentials not configured');
    }

    AWS.config.update({
      accessKeyId: environment.s3.accessKeyId,
      secretAccessKey: environment.s3.secretAccessKey,
      region: environment.s3.region
    });

    this.s3 = new AWS.S3();
    this.bucketName = environment.s3.bucketName;
    logger.info('? AWS S3 storage initialized');
  }

  initializeMinIO() {
    if (!environment.minio.endpoint) {
      throw new Error('MinIO endpoint not configured');
    }

    this.minioClient = new Minio.Client({
      endPoint: environment.minio.endpoint.split(':')[0],
      port: parseInt(environment.minio.endpoint.split(':')[1]) || 9000,
      useSSL: environment.minio.useSSL,
      accessKey: environment.minio.accessKey,
      secretKey: environment.minio.secretKey
    });

    this.bucketName = environment.minio.bucketName;
    logger.info('? MinIO storage initialized');
  }

  initializeLocal() {
    this.storagePath = environment.storage.localPath;
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
      logger.info(`Created local storage directory: ${this.storagePath}`);
    }
    
    logger.info('? Local filesystem storage initialized');
  }

  async uploadFile(file, employeeId, category = 'general') {
    const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = this.getFilePath(employeeId, category, fileName);

    switch (this.storageType) {
      case 'S3':
        return await this.uploadToS3(file, filePath);
      case 'MINIO':
        return await this.uploadToMinIO(file, filePath);
      case 'LOCAL':
      default:
        return await this.uploadToLocal(file, filePath);
    }
  }

  async uploadToLocal(file, filePath) {
    return new Promise((resolve, reject) => {
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFile(filePath, file.buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            path: filePath,
            url: `/documents/${path.relative(this.storagePath, filePath)}`,
            filename: path.basename(filePath)
          });
        }
      });
    });
  }

  async uploadToS3(file, filePath) {
    const params = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private'
    };

    const result = await this.s3.upload(params).promise();
    return {
      path: result.Key,
      url: result.Location,
      filename: path.basename(filePath)
    };
  }

  async uploadToMinIO(file, filePath) {
    const metaData = {
      'Content-Type': file.mimetype
    };

    await this.minioClient.putObject(
      this.bucketName,
      filePath,
      file.buffer,
      file.size,
      metaData
    );

    const url = `https://${environment.minio.endpoint}/${this.bucketName}/${filePath}`;
    return {
      path: filePath,
      url: url,
      filename: path.basename(filePath)
    };
  }

  getFilePath(employeeId, category, fileName) {
    // Structure: employee_id/category/filename
    return path.join(employeeId, category, fileName);
  }

  async deleteFile(filePath) {
    switch (this.storageType) {
      case 'S3':
        const s3Params = {
          Bucket: this.bucketName,
          Key: filePath
        };
        await this.s3.deleteObject(s3Params).promise();
        break;
      case 'MINIO':
        await this.minioClient.removeObject(this.bucketName, filePath);
        break;
      case 'LOCAL':
      default:
        const fullPath = path.join(this.storagePath, filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        break;
    }
  }

  async getFileUrl(filePath) {
    switch (this.storageType) {
      case 'S3':
        const s3Params = {
          Bucket: this.bucketName,
          Key: filePath,
          Expires: 3600 // URL expires in 1 hour
        };
        return this.s3.getSignedUrl('getObject', s3Params);
      case 'MINIO':
        return this.minioClient.presignedGetObject(
          this.bucketName,
          filePath,
          3600
        );
      case 'LOCAL':
      default:
        return `/api/documents/${filePath}`;
    }
  }
}

// Create singleton instance
const storageService = new StorageService();

module.exports = storageService;