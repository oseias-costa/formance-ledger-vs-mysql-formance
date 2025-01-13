
DROP SCHEMA IF EXISTS `ledger`;
CREATE SCHEMA `ledger`;
USE `ledger`;

CREATE TABLE ledger.TransactionType (
  id int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  description varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY TransactionType_UNIQUE (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (1, "V2_ACCOUNT_RECEIVE", "Envio de pontos");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (2, "V2_EXCHANGE", "Troca por prêmio");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (3, "V2_CHARGEBACK", "Estorno de prêmio");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (4, "V2_ACCOUNT_SEND", "Envio de pontos");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (5, "V2_ADD_POINTS", "Compra de pontos");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (6, "V2_REMOVE_POINTS", "Remoção de pontos");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (7, "V2_USER_TO_VENDOR", "Estorno pagamento incorreto");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (8, "V2_POINTS_FROM_USER", "Estorno pagamento incorreto");
INSERT INTO ledger.TransactionType (id, `key`, description) VALUES (9, "V2_CREDIT_BY_API", "Envio de pontos");

CREATE TABLE ledger.Transaction (
  id int unsigned NOT NULL AUTO_INCREMENT,
  transactionTypeId int unsigned NOT NULL,
  reference varchar(512) NOT NULL,
  revertionTxId int unsigned DEFAULT NULL,
  legacyTxId int unsigned DEFAULT NULL,
  description varchar(255) DEFAULT NULL,
  note varchar(512) DEFAULT NULL,
  isFraud tinyint(1) NOT NULL DEFAULT '0',
  fraudAnalysis json DEFAULT NULL,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY Transaction_reference_UNIQUE (reference),
  UNIQUE KEY Transaction_legacyTxId_UNIQUE (legacyTxId),
  KEY Transaction_TransactionType_FK (transactionTypeId),
  KEY Transaction_Transaction_FK (revertionTxId),
  CONSTRAINT Transaction_Transaction_FK FOREIGN KEY (revertionTxId) REFERENCES Transaction (id),
  CONSTRAINT Transaction_TransactionType_FK FOREIGN KEY (transactionTypeId) REFERENCES TransactionType (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE ledger.Movement (
  id int unsigned NOT NULL AUTO_INCREMENT,
  amount decimal(12,2) NOT NULL,
  source varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  destination varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  transactionId int unsigned NOT NULL,
  PRIMARY KEY (id),
  KEY Movement_Transaction_FK (transactionId),
  KEY Movement_source_IDX (source) USING BTREE,
  KEY Movement_destination_IDX (destination) USING BTREE,
  CONSTRAINT Movement_Transaction_FK FOREIGN KEY (transactionId) REFERENCES Transaction (id),
  CONSTRAINT Movement_amount_gt_zero_CHECK CHECK ((amount > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

