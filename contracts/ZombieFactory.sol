pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ownable.sol";
import "./safemath.sol";

contract ZombieFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewZombie(uint256 zombieId, string name, uint256 dna);
    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
    uint256 public dnaDigits = 16;
    uint256 public dnaModulus = 10**dnaDigits;
    uint256 public cooldownTime = 1 days;
    uint256 public currentIndex;
    struct Zombie {
        string name;
        uint256 dna;
        uint256 index;
    }

    Zombie[] public zombies;

    mapping(uint256 => address) public zombieToOwner;
    mapping(address => uint256) ownerZombieCount;
    mapping (uint => address) zombieApprovals;


    function _createZombie(string memory _name, uint256 _dna) internal {
        uint256 id = zombies.push(Zombie(_name, _dna,currentIndex)) - 1;
        currentIndex++;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
        emit NewZombie(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str)
        public
        view
        returns (uint256)
    {
        uint256 rand = uint256(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomZombie(string memory _name) public {
        uint256 randDna = _generateRandomDna(_name);
        randDna = randDna - (randDna % 100);
        _createZombie(_name, randDna);
    }

    function getZombiesByOwner(address _owner)
        public
        view
        returns (Zombie[] memory)
    {
        Zombie[] memory result = new Zombie[](ownerZombieCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < zombies.length; i++) {
            if (zombieToOwner[i] == _owner) {
                result[counter]  = zombies[i];
                counter++;
            }
        }
        return result;
    }
    function _transfer(address _from, address _to, uint256 _tokenId) public {
    ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
    zombieToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) public returns(bool)  {
      require (zombieToOwner[_tokenId] == msg.sender || zombieApprovals[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
      return true;
    }

}
